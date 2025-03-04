// Supabase Configuration
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to submit comment
document.getElementById("commentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    let name = document.getElementById("name").value.trim();
    let message = document.getElementById("message").value.trim();
    
    if (!name || !message) return alert("Please fill in all fields.");

    let { error } = await supabase.from("comments").insert([{ name, message }]);

    if (error) {
        alert("Error posting comment: " + error.message);
    } else {
        document.getElementById("commentForm").reset();
        loadComments(); // Reload comments after posting
    }
});

// Function to load comments
async function loadComments() {
    let { data, error } = await supabase.from("comments").select("*").order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching comments:", error.message);
        return;
    }

    let messagesList = document.getElementById("messages");
    messagesList.innerHTML = ""; // Clear existing messages

    data.forEach((comment) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${comment.name}:</strong> ${comment.message}`;
        messagesList.appendChild(listItem);
    });
}

// Load comments on page load
loadComments();
