import {ApplicationCommand} from 'discord.js';
const commands = [{
    name:"auto-responses",
    description:"ردود تلقائي",
    options:[{
        name:"add",
        description:"اضافة رد تلقائي",
        type:1,
        options:[{
            name:"reply",
            description:"اذا كنت تريد جعل الرد يكون عبر رسالة رد",
            type:"BOOLEAN",
            required:true
        }]
    },{
        name:"remove",
        description:"حذف رد تلقائي",
        type:1,
        options:[{
            name:"id",
            description:"الرقم التعريفي للرد التي تريد حذفها",
            type:"STRING",
            required:true
        }]
    },{
        name:"list",
        description:"عرض الردود التلقائية",
        type:1
    }]
}]

export default async function(client) {
    client.application.commands.fetch().then(async currentCommands => {
        let newCommands = commands.filter((command) => !currentCommands.some((c) => c.name === command.name));
        for (let newCommand of newCommands) {
            await client.application.commands.create(newCommand);
        }
        let updatedCommands = commands.filter((command) => currentCommands.some((c) => c.name === command.name));
        let updatedCommandCount = 0;
        for (let updatedCommand of updatedCommands) {
            const previousCommand = currentCommands.find((c) => c.name === updatedCommand.name);
            const newCommand = updatedCommand;
            let modified = false;
            if (previousCommand.description !== newCommand.description) modified = true;
            if (!ApplicationCommand.optionsEqual(previousCommand.options ?? [], newCommand.options ?? [])) modified = true;
            if (modified) {
                await previousCommand.edit(newCommand);
                updatedCommandCount++;
            }
        }
        let deletedCommands = currentCommands.filter((command) => !commands.some((c) => c.name === command.name)).toJSON();
        for (let deletedCommand of deletedCommands) {
            await deletedCommand.delete();
        }
    })
};