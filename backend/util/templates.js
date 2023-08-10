const mjmlUtils = require("mjml-utils");
const path = require("path");
const newUserTemplatePath = path.join(
  __dirname,
  "../public/templates/newUserTemplate.html"
);

const newUserTemplate = async (message) => {
  const html = await mjmlUtils.inject(newUserTemplatePath, {
    message,
  });
  return html;
};
 
module.exports = {newUserTemplate}