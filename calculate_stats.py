import pandas as pd
import numpy as np
import sys
import os

def calculate_team_stats(file_path):
    """
    Calculates team statistics from the ball-by-ball IPL dataset.
    """
    try:
        data = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.", file=sys.stderr)
        return None

    # Group by 'mid' (match ID) and 'batting_team' to get the final score for each team in each match
    final_scores = data.groupby(['mid', 'batting_team'])['total'].last().reset_index()
    
    # Identify the winner of each match by finding the team with the higher final score
    match_winners = final_scores.sort_values('total', ascending=False).groupby('mid').first().reset_index()
    match_winners.rename(columns={'batting_team': 'winner'}, inplace=True)
    
    # Calculate average score for each team
    avg_scores = final_scores.groupby('batting_team')['total'].mean().reset_index()
    avg_scores.columns = ['name', 'avg_score']
    
    # Count total matches played by each team
    matches_played = pd.concat([data['batting_team'], data['bowling_team']]).value_counts().reset_index()
    matches_played.columns = ['name', 'matches']
    
    # Count total wins for each team
    wins = match_winners.groupby('winner')['mid'].count().reset_index()
    wins.columns = ['name', 'wins']

    # Merge all stats
    team_stats = pd.merge(matches_played, wins, on='name', how='left')
    team_stats.fillna(0, inplace=True)
    team_stats['wins'] = team_stats['wins'].astype(int)
    team_stats = pd.merge(team_stats, avg_scores, on='name', how='left')
    
    # Calculate win rate
    team_stats['win_rate'] = np.where(team_stats['matches'] > 0, (team_stats['wins'] / team_stats['matches'] * 100).round(2), 0)
    
    return team_stats.sort_values('name')

def generate_seed_sql(team_stats):
    """
    Generates SQL INSERT statements from the calculated team statistics.
    """
    values = ",\n".join([
        f"('{row['name']}', {row['matches']}, {row['wins']}, {row['win_rate']}, {row['avg_score']})"
        for _, row in team_stats.iterrows()
    ])
    sql_script = f"INSERT INTO public.teams (name, matches, wins, win_rate, avg_score) VALUES\n{values};"
    return sql_script

def main():
    csv_file_path = 'public/data/ipl_data.csv'
    team_stats = calculate_team_stats(csv_file_path)
    if team_stats is not None:
        sql_output = generate_seed_sql(team_stats)
        print(sql_output)

if __name__ == "__main__":
    main()