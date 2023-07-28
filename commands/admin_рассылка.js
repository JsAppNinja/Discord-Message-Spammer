const dc = require("../commandlib/discord_command.js");
const discord = require('discord.js');
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const glob = require("../global");

class CommandMailingListRU extends dc.DiscordCommand {
    // constructor
    constructor(cmdName, cmdDescription) { 
        super(cmdName, cmdDescription)

        this._registerAction("cancel-button-ru");
    }

    /**
     * Action callback
     * @param {discord.Interaction} interaction Interaction;
     * @param {string} actionid Action ID
     */
    async onActionPress(interaction, actionid) {
        switch (actionid) {
            case "cancel-button-ru": {
                let i = 0;
                
                // glob.getMessageList().forEach((msg) => {
                //     if (msg[0] == interaction.user.id) {
                //         glob.getMessageList().splice(i, 1);
                //     }

                //     i++;
                // })

                while (i < glob.getMessageList().length) {
                    var obj = glob.getMessageList()[i];

                    if (obj[0] == interaction.user.id) {
                        obj[2].deleteReply();

                        glob.getMessageList().splice(i, 1);
                    }

                    i++;
                }

                interaction.reply({
                    "content": "Рассылка была отменена",
                    "ephemeral": true
                })

                break;
            }
        }
    }
    /**
    * **Run command.**
    * @param {discord.Interaction} interaction Interaction.
    */
    async run(interaction) {
        super.run(interaction);

        let i = 0;

        while (i < glob.getMessageList().length) {
            var obj = glob.getMessageList()[i];

            if (obj[0] == interaction.user.id) {
                interaction.reply({
                    "content": "**Вы уже начали процесс отправки рассылки!**\nНажмите на `Отменить действие` в предыдущем сообщении, чтобы отменить рассылку.",
                    "ephemeral": true
                })
                
                return;
            }

            i++;
        }
        
        let attachment = interaction.options.getAttachment("вложение");

        var data = {
            
        };

        if (attachment) {
            data["files"] = [{
                "attachment": attachment.url,
                "name": attachment.filename
            }];
        }
        
        glob.getMessageList().push([interaction.user.id, data, interaction, null, "ru"]);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cancel-button-ru')
                    .setStyle(discord.ButtonStyle.Danger)
                    .setLabel('Отменить действие'),
        )

        await interaction.reply({
            "embeds": [
                {
                  "type": "rich",
                  "title": `Отправьте сообщение, которое необходимо разослать`,
                  "description": "",
                  "color": 0x39AECF
                }
            ],
            "ephemeral": true,
            "components": [row]
        });
        
        return;
    }
}

module.exports = CommandMailingListRU;
