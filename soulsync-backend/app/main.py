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
        # If the message is a simple greeting like "hello", "hi", or "how are you?"
        if "hello" in message.lower() or "hi" in message.lower() or "how are you" in message.lower():
            # Respond with a simple empathetic greeting
            return {
                "status": "success", 
                "response": f"Hello! I'm here to assist you with any challenges you're facing. How are you feeling today? Let me know if you'd like to talk about anything."
            }

        # Initialize tasks list
        tasks = []

        # 1. Empathy and Validation Task (specific to agent)
        empathy_task = Task(
            description=f"Respond empathetically to the user's message, acknowledging their emotions as valid and understandable. {agent.role}'s goal is to assist users with {agent.role}. Show understanding and support based on the specific mental health issue the user is facing, such as anxiety, depression, or stress. Validate their feelings and provide compassionate support.",
            expected_output="A compassionate, empathetic response that acknowledges the user's feelings and shows understanding, tailored to the user's mental health issue.output not more than 10 line",
            input_value=message,
            input_type="str",
            agent=agent,
        )
        tasks.append(empathy_task)

        # 2. Coping Strategy Task (specific to agent)
        coping_task = Task(
            description=f"Provide a coping strategy for the user's issue, such as deep breathing for anxiety, thought reframing for depression, or grounding exercises for PTSD. Suggest practical and actionable steps tailored to {agent.role}'s goal, helping the user manage their emotional state effectively.",
            expected_output="A practical coping strategy tailored to the specific emotional issue.output not more than 15 line",
            input_value=message,
            input_type="str",
            agent=agent,
        )
        tasks.append(coping_task)

        # 3. Mindfulness Exercise Task (specific to agent)
        mindfulness_task = Task(
            description=f"Suggest a mindfulness or relaxation exercise that is aligned with {agent.role}'s goal. For example, for anxiety, a deep breathing exercise; for depression, a gratitude practice; or for PTSD, a grounding technique. Guide the user through a simple, actionable exercise.",
            expected_output="A tailored mindfulness exercise or relaxation technique to help the user manage their emotional state.output not more than 15 line",
            input_value=message,
            input_type="str",
            agent=agent,
        )
        tasks.append(mindfulness_task)

        # 4. Goal-Setting Task (specific to agent)
        goal_setting_task = Task(
            description=f"Help the user set a small, achievable goal specific to {agent.role}'s work. For example, for anxiety, setting a manageable task that feels less overwhelming. For depression, setting a goal related to self-care. Encourage the user to break down their larger goals into smaller, actionable steps.",
            expected_output="A small, manageable goal that aligns with the user's issue.output not more than 15 line",
            input_value=message,
            input_type="str",
            agent=agent,
        )
        tasks.append(goal_setting_task)

        # Create the Crew and execute tasks sequentially
        crew = Crew(
            agents=[agent],
            tasks=tasks,
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
    
# Gratitude Garden logic
gratitude_items = []

@app.route('/api/gratitude', methods=['GET', 'POST'])
def gratitude_garden():
    global gratitude_items
    if request.method == 'POST':
        data = request.get_json()
        item = data.get("item")
        if not item:
            return jsonify({"status": "error", "error": "Gratitude item is required"}), 400

        gratitude_items.append(item)
        return jsonify({"status": "success", "message": "Gratitude item added!", "items": gratitude_items}), 200

    elif request.method == 'GET':
        return jsonify({"status": "success", "items": gratitude_items}), 200

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
