handleErr = (err, req, res, next) => {
  if (err.pokeErrCode)
    res.status(err.pokeErrCode)
  else
    res.status(500)
  res.send(err.message)
}

module.exports = { handleErr }