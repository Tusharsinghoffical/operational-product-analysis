"""
Groq AI Integration Service
Provides AI-powered insights and analysis using Groq API
"""
import os
from groq import Groq
from typing import List, Dict, Any
import json

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)


def generate_business_insights(data_summary: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Generate AI-powered business insights using Groq
    
    Args:
        data_summary: Summary of business data including metrics, trends, and anomalies
    
    Returns:
        List of insight dictionaries with message, severity, and timestamp
    """
    prompt = f"""
    You are an AI business analyst. Analyze the following business data and provide 3-5 actionable insights.
    
    Business Data Summary:
    {json.dumps(data_summary, indent=2)}
    
    For each insight, provide:
    1. A clear, specific message about what you found
    2. Severity level: "High", "Medium", or "Low"
    3. A brief recommendation
    
    Format your response as a JSON array like this:
    [
        {{
            "message": "Specific insight about the data",
            "severity": "High/Medium/Low",
            "recommendation": "What action to take"
        }}
    ]
    
    Focus on:
    - Revenue trends and patterns
    - Expense anomalies
    - Inventory issues
    - Risk factors
    - Opportunities for improvement
    
    Be specific and actionable. Return ONLY valid JSON.
    """
    
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert business analyst AI that provides clear, actionable insights from business data."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1000,
        )
        
        # Parse the response
        content = response.choices[0].message.content
        
        # Extract JSON from response (handle potential markdown code blocks)
        if "```" in content:
            # Extract JSON from code block
            start = content.find("```json") + 7 if "```json" in content else content.find("```") + 3
            end = content.rfind("```")
            content = content[start:end].strip()
        
        insights = json.loads(content)
        
        # Add timestamp to each insight
        from datetime import datetime
        for insight in insights:
            insight["timestamp"] = datetime.utcnow().isoformat()
        
        return insights
        
    except Exception as e:
        print(f"Error generating insights with Groq: {e}")
        # Return fallback insights
        return get_fallback_insights()


def analyze_data_quality(data_summary: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze data quality and provide recommendations
    
    Args:
        data_summary: Summary of uploaded data
    
    Returns:
        Dictionary with quality score and recommendations
    """
    prompt = f"""
    Analyze the quality and completeness of this business dataset:
    
    {json.dumps(data_summary, indent=2)}
    
    Provide:
    1. Overall data quality score (0-100)
    2. List of any issues found
    3. Recommendations for improvement
    
    Format as JSON:
    {{
        "quality_score": 85,
        "issues": ["issue 1", "issue 2"],
        "recommendations": ["rec 1", "rec 2"]
    }}
    
    Return ONLY valid JSON.
    """
    
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a data quality expert."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            max_tokens=500,
        )
        
        content = response.choices[0].message.content
        
        if "```" in content:
            start = content.find("```json") + 7 if "```json" in content else content.find("```") + 3
            end = content.rfind("```")
            content = content[start:end].strip()
        
        return json.loads(content)
        
    except Exception as e:
        print(f"Error analyzing data quality: {e}")
        return {
            "quality_score": 75,
            "issues": ["Unable to perform detailed analysis"],
            "recommendations": ["Ensure data is complete and properly formatted"]
        }


def get_fallback_insights() -> List[Dict[str, str]]:
    """Return fallback insights if Groq API fails"""
    from datetime import datetime
    
    return [
        {
            "message": "Revenue shows positive growth trend over the analyzed period",
            "severity": "Low",
            "timestamp": datetime.utcnow().isoformat(),
            "recommendation": "Continue monitoring growth metrics"
        },
        {
            "message": "Consider reviewing expense patterns for optimization opportunities",
            "severity": "Medium",
            "timestamp": datetime.utcnow().isoformat(),
            "recommendation": "Analyze expense categories for cost reduction"
        },
        {
            "message": "Inventory levels appear stable",
            "severity": "Low",
            "timestamp": datetime.utcnow().isoformat(),
            "recommendation": "Maintain current inventory management practices"
        }
    ]


def summarize_data_insights(df_summary: Dict[str, Any]) -> str:
    """
    Generate a natural language summary of data insights
    
    Args:
        df_summary: Summary statistics of the dataframe
    
    Returns:
        Natural language summary string
    """
    prompt = f"""
    Provide a concise, executive-level summary of this business data:
    
    {json.dumps(df_summary, indent=2)}
    
    Include:
    - Key findings (2-3 sentences)
    - Main concerns (1-2 sentences)
    - Recommended actions (1-2 sentences)
    
    Keep it under 150 words. Be specific and actionable.
    """
    
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a business consultant providing executive summaries."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.6,
            max_tokens=300,
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Data analysis complete. Review detailed insights for specific findings and recommendations."
