import ollama
import json
import re
from pydantic import BaseModel


# Define the Pydantic model for each idea
class Idea(BaseModel):
    id: int
    title: str
    roi: int  # ROI out of 10
    roi_reason: str  # Reasoning behind the ROI score
    effort: int  # Effort out of 10
    effort_reason: str  # Reasoning behind the Effort score
    rank: int  # Rank based on ROI and effort

# Define the prompt to Ollama with the desired structured response format
prompt = """
Rank the following ideas based on ROI (Return on Investment) and Effort relative to the other ideas, dont just use the rank to increment the ideas:
THIS IS A MUST: Do not reuse rank numbers, first count the number of ideas then only use rank numbers once.
You must rank all ideas. Do not output anything that isn't said in the format below
Please respond in the following format for each idea:

Idea 1:
Title: Ex: Implement a new feature for user account management
ROI: <ROI>/10
ROI Reason: <Explanation for the ROI rating>
Effort: <Effort>/10
Effort Reason: <Explanation for the Effort rating>
Rank: <rank>

Idea 2:
Title: <Title>
ROI: <ROI>/10
ROI Reason: <Explanation for the ROI rating>
Effort: <Effort>/10
Effort Reason: <Explanation for the Effort rating>
Rank: <rank>

Idea 3:
Title: <Title>
ROI: <ROI>/10
ROI Reason: <Explanation for the ROI rating>
Effort: <Effort>/10
Effort Reason: <Explanation for the Effort rating>
Rank: <rank>

Please rate each idea and provide the results in the specified format.

Here are the following ideas to rank followed by a number that is the number of ideas, please only use each number once:

"""

# Load the ideas from the ideas.json file
with open('ideas.json', 'r') as file:
    ideas_data = json.load(file)

idea_count = 0
for idea in ideas_data:
    prompt = prompt + idea['title'] + " - Description: " + idea['description'] + "\n"
    idea_count += 1  # Increment idea_count properly
prompt = prompt + "Idea Count: " + str(idea_count)

# Call Ollama's API to get a response
response = ollama.chat(model='mistral', messages=[
    {
        'role': 'user',
        'content': prompt,
    }
])

# Extract the response content (this is assuming the response contains the ratings, reasons, and ranking)
response_content = response['message']['content']

# Initialize list of structured ideas
ideas = []

# Regex pattern to extract the title, ROI, ROI Reason, Effort, Effort Reason, and Rank
title_pattern = r"Title:\s*(.*?)\n"
roi_pattern = r"ROI:\s*(\d)/10"
roi_reason_pattern = r"ROI Reason:\s*(.*?)\n"
effort_pattern = r"Effort:\s*(\d)/10"
effort_reason_pattern = r"Effort Reason:\s*(.*?)\n"
rank_pattern = r"Rank:\s*(\d+)"

# Split by idea (each idea is separated by a new line)
ideas_raw = response_content.split("\n\n")  # Split by double newline
i = 0
for idx, idea_block in enumerate(ideas_raw, start=1):
    
    # Extract the title using regex
    title_match = re.search(title_pattern, idea_block)
    roi_match = re.search(roi_pattern, idea_block)
    roi_reason_match = re.search(roi_reason_pattern, idea_block)
    effort_match = re.search(effort_pattern, idea_block)
    effort_reason_match = re.search(effort_reason_pattern, idea_block)
    rank_match = re.search(rank_pattern, idea_block)

    # Extract the title, ROI, ROI Reason, Effort, Effort Reason, and Rank
    title = title_match.group(1).strip() if title_match else f"Unknown Idea {idx}"
    roi = int(roi_match.group(1)) if roi_match else 0
    roi_reason = roi_reason_match.group(1).strip() if roi_reason_match else "No reason provided"
    effort = int(effort_match.group(1)) if effort_match else 0
    effort_reason = effort_reason_match.group(1).strip() if effort_reason_match else "No reason provided"
    rank = int(rank_match.group(1)) if rank_match else idx  # Default to idx if no rank provided
    i += 1
    # Add the structured data to the list of ideas
    ideas.append({
        'id': i,
        'title': title,
        'roi': roi,
        'roi_reason': roi_reason,
        'effort': effort,
        'effort_reason': effort_reason,
        'rank': rank,  # Rank based on the extracted rank
    })
    

# Print the ranked ideas in JSON format to stdout
print(json.dumps(ideas, indent=4))  # Print the ideas as formatted JSON
