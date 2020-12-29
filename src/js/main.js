import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../css/main.css';

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new Calendar(calendarEl, {
    plugins: [ interactionPlugin, dayGridPlugin ],
    headerToolbar: {
      left: 'prevYear,prev,next,nextYear today',
      center: 'title',
      right: 'dayGridMonth'
    },
    weekends: true,
    selectable: true,
    editable: true,
    // aspectRatio: 2,
    select: function(array) {
      console.log(array.start);
      console.log(array.startStr);
      console.log(array.allDay);
      console.log(array.view);
      settingsStore();
    },
    // dateClick: function(info) {
    //   alert('Clicked on: ' + info.dateStr);
    //   alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
    //   alert('Current view: ' + info.view.type);
    //   // change the day's background color just for fun
    //   info.dayEl.style.backgroundColor = 'red';
    // }
    eventClick: function(currentDateTarget) {
      console.log(currentDateTarget.event._instance);
      // if (confirm('Are you sure you want to delete this event?')) {
      //   arg.event.remove()
      // }
    },
    events: [
      {
        title: 'All Day Event',
        start: '2020-12-01'
      },
      {
        title: 'Long Event',
        start: '2020-12-07',
        end: '2020-12-10'
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: '2020-12T16:00:00'
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: '2020-12-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2020-12-11',
        end: '2020-12-13'
      },
      {
        title: 'Meeting',
        start: '2020-12-12T10:30:00',
        end: '2020-12-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2020-12-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2020-12-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2020-12-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2020-12-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2020-12-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2020-12-28'
      }
    ]
  });

  calendar.render();
});

const settingsStore = () => {
  console.log(123213);
};

const exampleModal = document.getElementById('exampleModal')
exampleModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget
  console.log(button);
  // Extract info from data-bs-* attributes
  // var recipient = button.getAttribute('data-bs-whatever')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  // var modalTitle = exampleModal.querySelector('.modal-title')
  // var modalBodyInput = exampleModal.querySelector('.modal-body input')

  // modalTitle.textContent = 'New message to ' + recipient
  // modalBodyInput.value = recipient
})

const leaveItems = [];
document.querySelector("#leaveType").addEventListener('change', function(e) {
  const selectedLeaveType = e.target.value;
  const leaveItem = document.createElement('span');
  leaveItem.innerText = selectedLeaveType;

  const leaveDate = {
    name: selectedLeaveType,
  }

  leaveItems.concat(leaveDate);
  console.log(leaveItems);
  drawLeaveList(leaveItems);
});

function drawLeaveList(leaveItems) {
  
}