module.exports = {
	name: 'rules',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		let content = `**__قوانين السيرفر:__**\n
\`\`\`diff\n
- Mute 1h | يجب إحترام جميع الأعضاء وعدم مضايقتهم بأي شكل من الأشكال  
- Mute 1h | يجب إحترام جميع الأعضاء وعدم مضايقتهم بأي شكل من الأشكال  
- Mute 1d | يمنع إزعاج الأعضاء أو التنمر عليهم 
- Mute 1d | يجب إحترام خصوصية الأعضاء وعدم مضايقتهم أو إحراجهم 
- Mute 1h | ممنوع تخطي أغنية عضو سابق أو التخريب عليه 
- Mute 7d | ممنوع نشر الصور المقززة والمخلة بالآداب أو ما شابه  
- Ban     | ممنوع عمل ترويج لسيرفر آخر بالخاص أو بالعام  
- Mute 7d | السيرفر غير مسؤول عن المشاكل الشخصية ، يرجى تصفيتها خارج السيرفر 
- Kick    | ممنوع دخول السيرفر بصورة أو إسم غير لائق\`\`\`
**__Rules  Server:__**\n
\`\`\`fix
- All members must be respected and not harassed in any way.                                | Mute 1h
- It's forbidden to disturb or bully the members.                                           | Mute 1d
- Member's privacy should be respected and not harassed or embarrassed.                     | Mute 1d
- Don't ever skip a member's song.                                                          | Mute 1h
- It's forbidden to publish abusive, indecent images or similar.                            | Mute 7d
- It's forbidden to promote another server publicly or privately.                           | Ban
- The server isn't responsible for personal problems, please solve them outside the server. | Mute 7d
- It's forbidden to enter the server with an inappropriate picture or name.                 | Kick\`\`\`
`;
		message.channel.send({ content: content });
	},
};
/*


*/
