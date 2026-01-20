function validateDealCreate(data) {
  if (!data.title || !data.value || !data.accountId) {
    throw new Error("Missing required deal fields")
  }
}

module.exports = { validateDealCreate }
