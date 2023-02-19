const emailHTML = (name) => {
  return `
       <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" style="font-family:Poppins,sans-serif;background-color:white">

  <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <title>Contact Us</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins" rel="stylesheet" />
  </head>
  <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em">
    <tr style="width:100%">
      <td>
        <table style="display:grid;place-items:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
          <tbody>
            <tr>
              <td><img alt="logo" src="https://agb-tech.onrender.com/static/media/Logo.4ad01a447e8ca64ed621.png" style="display:block;outline:none;border:none;text-decoration:none;margin-left:auto;margin-right:auto;width:40%" /></td>
            </tr>
          </tbody>
        </table>
        <h1 style="text-align:center">Contact Us</h1>
        <p style="font-size:1rem;line-height:24px;margin:16px 0;font-family:Poppins,sans-serif;margin-bottom:5px">Hi ${name},</p>
        <p style="font-size:1rem;line-height:24px;margin:16px 0;font-family:Poppins,sans-serif">You recently sent us a message through our contact form.<br />We will have our employees at customer service to attend to you immediately</p>
        <p style="font-size:1rem;line-height:24px;margin:16px 0;font-family:Poppins,sans-serif;margin-bottom:5px">Regards,</p>
        <p style="font-size:1rem;line-height:24px;margin:16px 0;font-family:Poppins,sans-serif">The AGB Tech Team</p>
      </td>
    </tr>
  </table>

</html>
`
}

module.exports = emailHTML
