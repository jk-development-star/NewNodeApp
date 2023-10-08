const calendarView = (req, res) => {
  res.render("newViews/calendar/calendar", {
        layout: true,
    user : req.user,
    title: "Calendar",
  });
};

module.exports = calendarView;
