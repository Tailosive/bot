const config = {
  prefix: '!',
  owner: '392347814413467655',
  main_guild: '482026415219408907',
  roles: {
    mod_role: '485695273482452996',
    mute_role: '486046837762031626',
    trusted_role: '625156977412014090',
    donator_role: '579120451079372800',
    // tech, patreon, talks, tech yt, gaming, gaming yt
    donator_roles: ['488501367812653067', '485687224445173762', '506263722512351252', '488496129579679744', '485712426415947776', '488495733004304394', '647157005840023577']
  },
  channels: {
    log_channel: '485931120442081291',
    message_channel: '531362264792563722',
    member_channel: '583032850505269268',
    nickname_channel: '644989565287006228',
    bot_channel: '548956714217766912',
    notification_channel: '501504168754675745'
  },
  embed: {
    icon: 'https://file.coffee/gp_6uQZnC.png',
    text: 'Tailosive',
    color: 0xA660E3
  },
  url: 'https://mods.tailosive.net/',
  callbackURL: 'https://mods.tailosive.net/discord/callback'
}

module.exports = config
