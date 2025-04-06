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
You are an AI assistant for a Hackathon organization at Indiana University.
Your primary role is to help organize and streamline tasks related to planning, 
promoting, and executing hackathon events. You will assist in evaluating project
ideas, generating promotional content, managing communications, and coordinating
event logistics to ensure a successful and engaging experience for all participants.

Your task: Rank the following ideas based on ROI (Return on Investment) and Effort.

⚠️ VERY IMPORTANT: FOLLOW THIS FORMAT EXACTLY. DO NOT ADD EXTRA INDENTATION, QUOTES, OR FORMATTING. 
DO NOT OUTPUT ANYTHING ON THE SAME LINE AS THE IDEA NUMBER, AND THE TITLE SHOULD BE THE TITLE AND NOT THE DESCRIPTION
USE THE SAME TITLE AS IS GIVEN AT THE BOTTOM

FORMAT EXAMPLE:
Idea 1:
Title: Smart Hackathon Onboarding Bot  
ROI: 9/10  
ROI Reason: Improves participant experience, increases engagement, and fosters team collaboration, which can lead to more successful projects and positive word-of-mouth.  
Effort: 8/10  
Effort Reason: Requires development of an AI assistant with personalization capabilities, but the payoff is significant.  
Rank: 1

Do not reuse rank numbers. Count how many ideas are given and only use each rank once.

DO NOT ADD EXTRA SPACES, DO NOT INDENT. ONLY RETURN RAW TEXT IN THE ABOVE FORMAT.

---

Here are the following ideas to rank (only use the number of ideas provided below):



"""

# Load the ideas from the ideas.json file
with open('ideas.json', 'r') as file:
    ideas_data = json.load(file)


idea_count = 0
for idea in ideas_data["ideas"]:  # Accessing the list inside the dictionary
    prompt = prompt + idea['title'] + " - Description: " + idea['description'] + "\n" # add the ideas onto the prompt
    idea_count += 1
prompt = prompt + "Idea Count: " + str(idea_count) # pass the idea count to ollama

weights = ideas_data.get("weights", {}) # get the weights from the ideas.json file
roi_weight = weights.get("roiWeight", 5)
effort_weight = weights.get("effortWeight", 5)

prompt += f"\nUse these weights as guidance for the overall rank, first rank each idea and use the roi/effort weights to determine the final rank:\nROI Weight: {roi_weight}/10\nEffort Weight: {effort_weight}/10\n\n"
# pass the weights to the prompt

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
