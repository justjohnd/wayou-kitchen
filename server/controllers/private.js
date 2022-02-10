exports.getPrivateData = (req, res, next) => {
    console.log('wut');
  res.status(200).json({
    success: true,
    data: 'Yo yo you yo backend yo',
    id: req.user._id,
  });
};
