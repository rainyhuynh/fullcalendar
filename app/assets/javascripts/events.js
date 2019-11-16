var date_range_picker;
date_range_picker = function() {
  $('.date-range-picker').each(function(){
    $(this).daterangepicker({
        timePicker: true,
        timePickerIncrement: 30,
        alwaysShowCalendars: true
    }, function(start, end, label) {
        $('#event_date_range').val(start.format("MM/DD/YYYY HH:mm") + ' - ' + end.format("MM/DD/YYYY HH:mm"))
        $('.start_hidden').val(start.format('YYYY-MM-DD HH:mm'));
        $('.end_hidden').val(end.format('YYYY-MM-DD HH:mm'));
    });
  })
};


var initialize_calendar;
initialize_calendar = function() {
  $('.calendar').each(function(){
    var calendar = $(this);
    calendar.fullCalendar({
      //plugins: [ 'interaction', 'resourceDayGrid', 'resourceTimeGridDay' ],
      //defaultView: 'resourceTimeGridDay',
      //defaultDate: '2019-11-07',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,resourceTimeGridDay'
        //right: 'resourceTimeGridDay,resourceTimeGridTwoDay,timeGridWeek,dayGridMonth'
      },
      allDaySlot: false,
      selectable: true,
      selectHelper: true,
      editable: true,
      eventLimit: true,
      events: '/events.json',

      // resources: [
      //   { id: 'a', title: 'Room A' },
      //   { id: 'b', title: 'Room B', eventColor: 'green' },
      //   { id: 'c', title: 'Room C', eventColor: 'orange' },
      //   { id: 'd', title: 'Room D', eventColor: 'red' }
      // ],
      // events: [
      //   { id: '1', resourceId: 'a', start: '2019-11-06', end: '2019-11-08', title: 'event 1' },
      //   { id: '2', resourceId: 'a', start: '2019-11-07T09:00:00', end: '2019-11-07T14:00:00', title: 'event 2' },
      //   { id: '3', resourceId: 'b', start: '2019-11-07T12:00:00', end: '2019-11-08T06:00:00', title: 'event 3' },
      //   { id: '4', resourceId: 'c', start: '2019-11-07T07:30:00', end: '2019-11-07T09:30:00', title: 'event 4' },
      //   { id: '5', resourceId: 'd', start: '2019-117T10:00:00', end: '2019-11-07T15:00:00', title: 'event 5' }
      // ],

    //   minTime: "06:00:00",
    //   maxTime: "19:00:00",

      select: function(start, end) {
        $.getScript('/events/new', function() {
          date_range_picker();
          $('#event_date_range').val(moment(start).format("MM/DD/YYYY HH:mm") + ' - ' + moment(end).format("MM/DD/YYYY HH:mm"))
          $('.start_hidden').val(moment(start).format('YYYY-MM-DD HH:mm'));
          $('.end_hidden').val(moment(end).format('YYYY-MM-DD HH:mm'));
        });

        calendar.fullCalendar('unselect');
      },

      eventDrop: function(event, delta, revertFunc) {
        event_data = { 
          event: {
            id: event.id,
            start: event.start.format(),
            end: event.end.format()
          }
        };
        $.ajax({
            url: event.update_url,
            data: event_data,
            type: 'PATCH'
        });
      },

      eventResize: function(event){
        event_data = { 
            event: {
              id: event.id,
              start: event.start.format(),
              end: event.end.format()
            }
          };
          $.ajax({
              url: event.update_url,
              data: event_data,
              type: 'PATCH'
          });
      },
      
      eventClick: function(event, jsEvent, view) {
        $.getScript(event.edit_url, function() {
          $('#event_date_range').val(moment(event.start).format("MM/DD/YYYY HH:mm") + ' - ' + moment(event.end).format("MM/DD/YYYY HH:mm"))
          date_range_picker();
          $('.start_hidden').val(moment(event.start).format('YYYY-MM-DD HH:mm'));
          $('.end_hidden').val(moment(event.end).format('YYYY-MM-DD HH:mm'));
        });
      },

      dateClick: function(arg){
        console.log(arg.date)
      }
    });
  })
};


$(document).on('turbolinks:load', function(){
    initialize_calendar()
});