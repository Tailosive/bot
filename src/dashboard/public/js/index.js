console.warn('OWO, YOU SHOULDN\'T BE HERE UNLESS YOU KNOW WHAT YOUR DOING!')

$(document).ready(function () {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  $('#collapseMission').on('show.bs.collapse', function () {
    $('#shortMission').hide()
  })

  $('#collapseMission').on('hide.bs.collapse', function () {
    $('#shortMission').show()
  })

  $('.form-control').change(function (event) {
    const data = $(this).val()
    if (data === 'Newest') window.location.replace('/cases?sort=Newest')
    if (data === 'Oldest') window.location.replace('/cases?sort=Oldest')
    if (data === 'All cases') window.location.replace('/cases?type=All-cases')
    if (data === 'Warnings') window.location.replace('/cases?type=Warnings')
    if (data === 'Bans') window.location.replace('/cases?type=Bans')
    if (data === 'Kicks') window.location.replace('/cases?type=Kicks')
    if (data === 'Mutes') window.location.replace('/cases?type=Mutes')
  })
})
