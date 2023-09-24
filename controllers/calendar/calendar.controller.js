const calendarView = (req, res) => {
  res.render("newViews/calendar/calendar", {
    layout: true,
    title: "Calendar",
  });
};

module.exports = calendarView;
