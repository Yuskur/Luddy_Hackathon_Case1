import ollama
import json
import re
from pydantic import BaseModel

# Define the Pydantic model for each idea
class Idea(BaseModel):
    title: str
    roi: int  # ROI out of 10
    effort: int  # Effort out of 10
    rank: int  # Rank based on ROI and effort

# Define the prompt to Ollama with structured response format
prompt = """
Rank the following ideas based on ROI (Return on Investment) and Effort:
Please respond in the following format for each idea:

Idea 1:
Title: Implement a new feature for user account management
ROI: 0/10
ROI Reason: 
Effort: 0/10

Idea 2:
Title: Add real-time notifications to the app
ROI: 0/10
ROI Reason: 
Effort: 0/10

Idea 3:
Title: Improve search functionality
ROI: 0/10
ROI Reason
Effort: 0/10

Please rate each idea and provide the results in the specified format.
"""

# Call Ollama's API to get a response
response = ollama.chat(model='mistral', messages=[
    {
        'role': 'user',
        'content': prompt,
    }
])

# Extract the response content
response_content = response['message']['content']

# Initialize list of structured ideas
ideas = []

# Regex pattern to extract the title, ROI, and Effort values
title_pattern = r"Title:\s*(.*?)\n"
roi_pattern = r"ROI:\s*(\d)/10"
effort_pattern = r"Effort:\s*(\d)/10"

# Iterate over the response content and extract each idea's information
ideas_raw = response_content.split("\n\n")  # Split by double newline

for idx, idea_block in enumerate(ideas_raw, start=1):
    # Extract the title using regex
    title_match = re.search(title_pattern, idea_block)
    roi_match = re.search(roi_pattern, idea_block)
    effort_match = re.search(effort_pattern, idea_block)

    # Get the title, ROI, and Effort from matches
    title = title_match.group(1).strip() if title_match else "Unknown Idea"
    roi = int(roi_match.group(1)) if roi_match else 0
    effort = int(effort_match.group(1)) if effort_match else 0

    # Add the structured data to the list of ideas
    ideas.append({
        'title': title,
        'roi': roi,
        'effort': effort,
        'rank': idx,  # Rank based on the order received
    })

# Save the structured ideas to a JSON file
with open('ranked_ideas.json', 'w') as json_file:
    json.dump(ideas, json_file, indent=4)  # Write to a file with pretty print

print("Response saved to 'ranked_ideas.json'")
