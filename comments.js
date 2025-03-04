
  // Ensure script only runs after the page loads
document.addEventListener("DOMContentLoaded", async function () {
    console.log("Initializing Supabase...");

    // Initialize Supabase Client
    const SUPABASE_URL = "https://txlsmutqbtzpzscuafjr.supabase.co"; // Replace with your Supabase URL
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbHhzbXV0cXRicHp4c2NxdWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDU1MjksImV4cCI6MjA1NjU4MTUyOX0.NGivuTx7iP3Rhw5EgEiBoJ514yvx9Fsf_RxqMLC-H98"; // Replace with your actual Supabase key

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error("Supabase credentials are missing.");
        return;
    }

    const supabase = window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log("Supabase Initialized", supabase);

    // Attach event listener to Post button
    document.getElementById("postButton").addEventListener("click", async () => {
        await postMessage();
    });

    // Load messages on page load
    await loadMessages();

    // Function to post a new message
    async function postMessage() {
        const nameInput = document.getElementById("name");
        const messageInput = document.getElementById("message");

        if (!nameInput || !messageInput) {
            console.error("Missing input elements.");
            return;
        }

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) {
            alert("Please enter both a name and a message.");
            return;
        }

        const { error } = await supabase.from("comments").insert([{ name, message }]);

        if (error) {
            console.error("Error posting message:", error);
        } else {
            console.log("Message posted successfully!");
            nameInput.value = "";
            messageInput.value = "";
            await loadMessages();
        }
    }

    // Function to load messages from Supabase
    async function loadMessages() {
        const { data, error } = await supabase.from("comments").select("*").order("created_at", { ascending: false });

        if (error) {
            console.error("Error loading messages:", error);
            return;
        }

        const messageContainer = document.getElementById("messages");
        if (!messageContainer) {
            console.error("Message container not found.");
            return;
        }
        messageContainer.innerHTML = ""; // Clear previous messages

        data.forEach((msg) => {
            const messageElement = document.createElement("p");
            messageElement.innerHTML = `<strong>${msg.name}:</strong> ${msg.message}`;
            messageContainer.appendChild(messageElement);
        });
    }
});
