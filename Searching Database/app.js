// Adjust all search fields and queries as needed


//General Search - Multiple Tables
app.get("/api/search", async (req, res) => {
    const { q } = req.query;
  
    try {
      // Search for users
      const userSql = `SELECT * FROM users WHERE username LIKE ? OR full_name LIKE ?`;
      const [users] = await pool.query(userSql, [`%${q}%`, `%${q}%`]);
  
      // Search for posts
      const postSql = `SELECT title, content FROM posts WHERE title LIKE ? OR content LIKE ?`;
      const [posts] = await pool.query(postSql, [`%${q}%`, `%${q}%`]);
  
      // Search for events
      const eventSql = `SELECT event_name, event_description, event_date, location_text FROM events WHERE event_name LIKE ? OR event_description LIKE ? OR location_text LIKE ?`;
      const [events] = await pool.query(eventSql, [`%${q}%`, `%${q}%`, `%${q}%`]);
  
      // Search for polls
      const pollSql = 'SELECT question FROM polls WHERE question LIKE ?';
      const [polls] = await pool.query(pollSql, [`%${q}%`]);
  
      // Search for skills
      const skillSql = `SELECT * FROM skills WHERE skill_name LIKE ? OR description LIKE ?`;
      const [skills] = await pool.query(skillSql, [`%${q}%`, `%${q}%`]);
  
      // Combine the results
      const searchResults = {
        users: { count: users.length, data: users },
        posts: { count: posts.length, data: posts },
        events: { count: events.length, data: events },
        polls: {count: polls.length, data: polls},
        skills: { count: skills.length, data: skills },
      };
  
      res.json(searchResults);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
//Specific Search
app.get("/api/search/skills", async (req, res) => {
    const { q } = req.query;
  
    try {
      const skillSql =
        "SELECT skill_name, description, image_path FROM skills WHERE skill_name LIKE ? OR description LIKE ?";
      const [skill] = await pool.query(skillSql, [`%${q}%`, `%${q}%`]);
  
      if (skill.length > 0) {
        const skillResult = {
          skills: { count: skill.length, data: skill },
        };
        res.json(skillResult);
      } else {
        res.json({ message: `'${q}' not found. See more to request additions` });
      }
    } catch (error) {
      console.error("Error searching for skill:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  