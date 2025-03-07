export default (header_footer_color: string) => {
  return `
  <table style="width:100%;border-spacing:0;background-color:${header_footer_color ? header_footer_color : `#333333`}">
  <tbody>
    <tr>
      <td style="font-family:helvetica;padding-bottom:35px 0">
        <center>
          <table style="max-width:400px;text-align:center;border-spacing:0px;margin:10px auto;width:100%">
            <tbody>
              <tr>
                <td style="font-family:helvetica;font-size:30px;color:white"><a
                    href="https://www.facebook.com/Glow-LEDscom-100365571740684" target="_blank"
                    rel="noopener noreferrer"><img src="https://images2.imgbox.com/9b/a0/XAC4qmRL_o.png"
                      style="height:25px" alt="Facebook" title="Facebook Logo" /></a></td>
                <td style="font-family:helvetica;font-size:30px;color:white"><a
                    href="https://www.instagram.com/glow_leds/" target="_blank" rel="noopener noreferrer"><img
                      src="https://images2.imgbox.com/d2/77/vuk6FOeW_o.png" style="height:25px" alt="Instagram"
                      title="Instagram Logo" /></a></td>
                <td style="font-family:helvetica;font-size:30px;color:white"><a
                    href="https://www.tiktok.com/@glow_leds?lang=en" target="_blank"
                    rel="noopener noreferrer"><img src="https://images2.imgbox.com/c1/ea/6hNkTIwU_o.png"
                      style="height:22px" alt="Tiktok" title="Tiktok Logo" /></a></td>
                <td style="font-family:helvetica;font-size:30px;color:white"><a
                    href="https://www.youtube.com/channel/UCm_gDyTIy7d0oR9LeowPkYw?sub_confirmation=1"
                    target="_blank" rel="noopener noreferrer"><img
                      src="https://images2.imgbox.com/c9/83/3Z0OwK1r_o.png" style="height:22px" alt="Youtube"
                      title="Youtube Logo" /></a></td>
              </tr>
            </tbody>
          </table>
         
          <table
            style="max-width:560px;width:100%;text-align:left;border-spacing:0;margin:15px auto;color:white">
            <tr>
              <td style="font-family:helvetica;color:white">
                <div style="border-bottom:1px white solid"></div>
              </td>
            </tr>
          </table>
          <table
            style="max-width:800px;width:100%;text-align:left;border-spacing:0;margin:0 auto;color:white;margin-bottom:10px">
            <tr>
              <td style="font-family:helvetica;color:white">
                <p style="text-align:center;font-size:16px;color:white"><strong>Glow LEDs</strong> <br /><br />${
                  process.env.RETURN_ADDRESS
                } <br />${process.env.RETURN_CITY}, ${process.env.RETURN_STATE} ${process.env.RETURN_POSTAL_CODE} </p>
                <p style="text-align:center;font-size:16px;color:white">Copyright © 2022</p>
              </td>
            </tr>
          </table>
          <table
            style="max-width:800px;width:100%;text-align:left;border-spacing:0;margin:0 auto;color:white;margin-bottom:10px">
            <tr>
              <td style="font-family:helvetica;color:white; width: 100%;margin: auto;text-align: center;">
               <img src="https://images2.imgbox.com/78/52/dfNQTgC3_o.png" alt="logo" style="width:143px;">
              </td>
            </tr>
          </table>
        </center>
      </td>
    </tr>
  </tbody>
</table>`;
};
