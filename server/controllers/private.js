exports.getPrivateData = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "Yo yo you yo backend yo",
    id: req.user._id
  });
};
