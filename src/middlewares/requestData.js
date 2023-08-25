import { checkRequestData } from "../util/util.js";

export const validateRequestData = (req, res, next) => {
  const accountData = checkRequestData(req);
  const emptyAttributes = Object.keys(accountData)
    .filter((key) => !accountData[key])
    .join(", ");

  if (emptyAttributes !== "") {
    return res
      .status(400)
      .json({ mensagem: `${emptyAttributes} contains invalid information.` });
  }

  next();
};

export const validateRequiredProperties = (requiredProperties) => {
  return (req, res, next) => {
    const accountData = checkRequestData(req);

    for (const prop of requiredProperties) {
      if (!accountData.hasOwnProperty(prop)) {
        return res
          .status(400)
          .json({ mensagem: `${prop} was not provided in the request.` });
      }
    }

    next();
  };
};
