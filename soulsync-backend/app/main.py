from flask import Flask, request, jsonify
from flask_cors import CORS
from crewai import Agent, Crew, Task, Process
from langchain_groq import ChatGroq
import os

# Set up API key for ChatGroq
os.environ["GROQ_API_KEY"] = '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'

# Initialize the Groq LLM with parameters to limit response length and ensure conversational tone
llm = ChatGroq(temperature=0.7, model_name="groq/llama-3.3-70b-versatile")

# Define agents with original backstories and goals
anxiety_agent = Agent(
    role="Anxiety Supporter",
    goal="Help individuals manage anxiety by offering relaxation techniques, grounding exercises, and emotional support.",
    backstory="As an anxiety supporter, my role is to help users process feelings of anxiety and provide tools to cope with overwhelming feelings of nervousness and fear.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

depression_agent = Agent(
    role="Depression Supporter",
    goal="Guide users experiencing depression through empathy, small achievable steps, and positive reinforcement to regain joy and meaning in life.",
    backstory="I offer compassionate support for those battling feelings of sadness, emptiness, and hopelessness, helping them see light at the end of the tunnel.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

stress_agent = Agent(
    role="Stress Reliever",
    goal="Help users alleviate stress with calming techniques, time management strategies, and emotional regulation exercises.",
    backstory="As a stress-reliever, I help users manage overwhelming external pressures through mindfulness, organization, and self-care practices.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

loneliness_agent = Agent(
    role="Loneliness Supporter",
    goal="Help individuals feel connected and less isolated, promoting positive social interactions and self-compassion.",
    backstory="My job is to remind you that you're never truly alone and to help you reconnect with others and yourself in meaningful ways.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

eating_disorder_agent = Agent(
    role="Eating Disorder Supporter",
    goal="Assist individuals with disordered eating by exploring unhealthy patterns and offering healthier coping mechanisms.",
    backstory="As an eating disorder supporter, I help individuals build a healthier relationship with food and guide them toward healing from eating disorders.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

addiction_agent = Agent(
    role="Addiction Supporter",
    goal="Assist individuals with addiction to break free from unhealthy behaviors and guide them toward recovery.",
    backstory="My role is to help individuals trapped in cycles of addiction by providing support, coping strategies, and guidance toward rehabilitation.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

grief_loss_agent = Agent(
    role="Grief Supporter",
    goal="Support individuals dealing with grief and loss by providing emotional validation and healthy coping mechanisms.",
    backstory="As a grief supporter, I offer a compassionate ear to those mourning a loss and help them navigate their grief at their own pace.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

ptsd_agent = Agent(
    role="PTSD Supporter",
    goal="Help individuals with PTSD by providing grounding techniques and helping them process past trauma safely.",
    backstory="I offer understanding and strategies to cope with the emotional aftermath of trauma, helping users regain control and healing over time.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

bipolar_disorder_agent = Agent(
    role="Bipolar Disorder Supporter",
    goal="Support individuals with bipolar disorder through mood stabilization strategies and emotional regulation techniques.",
    backstory="As a bipolar disorder supporter, I provide emotional support and guide users through managing mood swings with helpful strategies.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

ocd_agent = Agent(
    role="OCD Supporter",
    goal="Assist individuals with OCD by offering coping strategies to manage intrusive thoughts and compulsive behaviors.",
    backstory="I help individuals with OCD navigate their struggles with obsessive thoughts and compulsive actions, offering tools to regain control of their lives.",
    llm=llm,
    max_iter=5,
    memory=True,
    verbose=True,
)

# Define the Flask app
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])  # Update CORS origin as needed

def handle_user_message(message, agent):
    try:
        task = Task(
            description=f"Respond empathetically and conversationally to the user about '{agent}'. The response should be unique each time and consider the emotional context based on user input. Offer actionable advice, empathy, and encouragement. Keep the tone supportive and relaxed. Don't repeat the same response — adjust the advice or suggestions based on what the user has shared, and offer new ways to help them cope.",
            expected_output="A varied, issue-specific, empathetic, and conversational response, offering actionable advice, encouragement, and follow-up questions.",
            input_value=message,
            input_type="str",
            agent=agent,
        )

        crew = Crew(
            agents=[agent],
            tasks=[task],
            verbose=True,
            process=Process.sequential,
            full_output=True,
            manager_llm=llm,
        )

        # Kick off the crew process and get the result
        results = crew.kickoff()

        if results:
            result_dict = {
                "status": "success",
                "response": str(results), 
            }
            return result_dict
        else:
            return {"status": "error", "error": "No response generated by the agent."}
    except Exception as e:
        return {"status": "error", "error": f"Error during processing: {str(e)}"}

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Parse incoming JSON data
        data = request.get_json()
        user_message = data.get("message")
        mental_health_issue = data.get("issue")

        if not user_message or not mental_health_issue:
            return jsonify({"status": "error", "error": "Message and issue are required"}), 400

        # Choose the appropriate agent based on the issue
        agent_map = {
            "anxiety": anxiety_agent,
            "depression": depression_agent,
            "stress": stress_agent,
            "loneliness": loneliness_agent,
            "eating_disorder": eating_disorder_agent,
            "addiction": addiction_agent,
            "grief_loss": grief_loss_agent,
            "ptsd": ptsd_agent,
            "bipolar_disorder": bipolar_disorder_agent,
            "ocd": ocd_agent,
        }

        agent = agent_map.get(mental_health_issue)
        if not agent:
            return jsonify({"status": "error", "error": "Invalid mental health issue"}), 400

        # Process the user message and generate a response
        response = handle_user_message(user_message, agent)

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"status": "error", "error": f"An internal error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
