
function handleLogOutPage(req, res) {
    try {
      // Render the 'home.ejs' template with the fetched URLs
      console.log("Logged Out:")
      return res.clearCookie("token").send({ message: "Logged Out Succefully Redirected... " , success:true});
    } catch (error) {
      console.error("Error fetching URLs:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }

  module.exports = {
    handleLogOutPage,
  };