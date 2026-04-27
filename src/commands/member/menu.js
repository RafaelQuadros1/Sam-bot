import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../config.js";
import { menuMessage, adminMenuMessage } from "../../menu.js";
import { DangerError } from "../../errors/index.js";

export default {
  name: "menu",
  description: "Menu de comandos",
  commands: ["menu", "help"],
  usage: `${PREFIX}menu ou ${PREFIX}menu adm`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    remoteJid,
    sendImageFromFile,
    sendSuccessReact,
    isAdmin,
    isBotOwner,
  }) => {
    await sendSuccessReact();

    const showAdminMenu = args[0]?.toLowerCase() === "adm";

    if (showAdminMenu && !isAdmin && !isBotOwner) {
      throw new DangerError(
        "❌ Apenas admins e o dono do bot podem acessar o menu admin!",
      );
    }

    const menu = showAdminMenu
      ? adminMenuMessage(remoteJid)
      : menuMessage(remoteJid);

    await sendImageFromFile(
      path.join(ASSETS_DIR, "images", "takeshi-bot.png"),
      `\n\n${menu}`,
    );
  },
};
