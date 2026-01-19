const contactService = require("./contact.service");

exports.convertLead = async (req, res) => {
  try {
    const result = await contactService.convertLeadToContact(
      req.params.leadId,
      req.user
    );

    res.json({
      success: true,
      message: "Lead converted successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
