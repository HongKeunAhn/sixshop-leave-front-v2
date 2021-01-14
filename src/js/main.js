import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as api from './repo/leaverApi';
import axios from 'axios';
import '@babel/polyfill';
import '../css/main.css';

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');

  const calendar = new Calendar(calendarEl, {
    plugins: [ interactionPlugin, dayGridPlugin ],
    headerToolbar: {
      left: 'prevYear,prev,next,nextYear today',
      center: 'title',
      right: 'dayGridMonth'
    },
    locale: 'ko',
    weekends: true,
    selectable: true,
    editable: true,
    select: function(array) {
      // console.log(array.start);
      // console.log(array.startStr);
      // console.log(array.allDay);
      // console.log(array.view);
    },
    // dateClick: function(info) {
    //   alert('Clicked on: ' + info.dateStr);
    //   alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
    //   alert('Current view: ' + info.view.type);
    //   // change the day's background color just for fun
    //   info.dayEl.style.backgroundColor = 'red';
    // }
    eventClick: async function(currentDateTarget) {
      const editModal = new bootstrap.Modal(document.querySelector('#editCalendarModal'));
      editModal.show();

      const { start } = currentDateTarget.event._instance.range;
      const formatDate = parsingFormatDate(start);

      const memberId = currentDateTarget.event._def.extendedProps.memberId;
      const leaveHistoryId = currentDateTarget.event._def.publicId;
      const memberName = currentDateTarget.event._def.title.substr(0,3);
      const leaveName = currentDateTarget.event._def.title.substr(4);
      let remainLeaveCount;
      await getMemberRemainLeaveCount(memberId)
      .then(memberRemainLeaveCount => {
        remainLeaveCount = memberRemainLeaveCount.payDate;
      });

      const leavePayCount = currentDateTarget.event._def.extendedProps.payCount;

      const rollbackLeaveCount = remainLeaveCount + leavePayCount;
      document.querySelector('#edit-recipient-date').value = formatDate;
      setSelectedOption('#edit-leaveType', leaveName);
      setSelectedOption('#leaveMember', memberName);
      

      /* ** 
        ** UPDATE **
        ** */
      document.querySelector('#modifyLeave').addEventListener('click', function() {
        const modifySelectedDateValue = document.querySelector('#edit-recipient-date').value;
        const modifySelectedLeaveTypeValue = document.querySelector('#edit-leaveType').value;
        const modifySelectedLeaveCount =  Number(document.querySelector('#edit-leaveType').options[document.querySelector('#edit-leaveType').selectedIndex].dataset.paydate);

        const modifyData = {
          start: modifySelectedDateValue,
          title: memberName + '-' + modifySelectedLeaveTypeValue,
          payCount: modifySelectedLeaveCount,
        }

        fetch('http://localhost:3001/leave-history/' + leaveHistoryId , {
          method: 'PATCH',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(modifyData)
        })
        .then(response => response)
        .then(result => {
          console.log(result);
          calendar.refetchEvents();
        });

        const modifyLeaveData = {
          payDate: rollbackLeaveCount - modifySelectedLeaveCount,
        }

        fetch('http://localhost:3001/member/' + memberId, {
          method: 'PATCH',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(modifyLeaveData)
        })
        .then(response => response.json())
        .then(result => {
          console.log(result);
          calendar.refetchEvents();
        });
        getMemberLeaveInfo(memberId);

      });

      /* ** 
        ** REMOVE **
        ** */
      document.querySelector('#removeLeave').addEventListener('click', function() {
        const leaveData = {
          payDate: remainLeaveCount + leavePayCount
        }

        fetch('http://localhost:3001/member/' + memberId, {
          method: 'PATCH',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(leaveData)
        })
        .then(response => response.json())
        .then(result => {
          console.log(result);
          calendar.refetchEvents();
        });

        fetch('http://localhost:3001/leave-history/' + leaveHistoryId , {
          method: 'DELETE',
        })
        .then(response => response)
        .then(result => {
          console.log(result);
          calendar.refetchEvents();
        });

        currentDateTarget.event.remove();
        getMemberLeaveInfo(memberId);
      });
    },

    /* ** 
      ** GET **
      ** */
    events: function () {
      return axios.get('http://localhost:3001/leave-history')
      .then(response => response.data);
    }
  });

  calendar.render();


  /* ** 
    ** POST **
    ** */
  document.querySelector('#saveEvent').addEventListener('click', function(e) {
    const memberName = document.querySelector('#leaveMember').value;
    const memberId = document.querySelector('#leaveMember').options[document.querySelector('#leaveMember').selectedIndex].dataset.id;

    if(!memberId) {
      alert('휴가자를 선택해라');
      return;
    }

    const selectedDate = document.querySelector('#recipient-date').value;
    const selectedLeaveType = document.querySelector('#leaveType').value;
    const selectedLeaveCount =  Number(document.querySelector('#leaveType').options[document.querySelector('#leaveType').selectedIndex].dataset.paydate);
    var eventId = getUniqueId();

    const remainInfoLeaveCount = +document.querySelector('#payDate').textContent;
    const remainLeavePayCount = remainInfoLeaveCount - selectedLeaveCount;
    const leaveCountData = {
      payDate: remainLeavePayCount
    }

    fetch('http://localhost:3001/member/' + memberId, {
      method: 'PATCH',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(leaveCountData)
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      calendar.refetchEvents();
    });
  
    const leaveData = {
          id: eventId,
          memberId: memberId,
          start: selectedDate,
          title: memberName + '-' + selectedLeaveType,
          payCount: selectedLeaveCount,
        };

        console.log(leaveData);
  
    fetch('http://localhost:3001/leave-history', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(leaveData)
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      calendar.refetchEvents();
      getMemberLeaveInfo(memberId);
    });
  });
});

/* ** 
    ** DRAW MEMBER OPTION TAG **
    ** */
function drawMemberOption() {
  fetch('http://localhost:3001/member', {
    method: 'GET'
  })
  .then(res => res.json())
  .then(body => {
    const memberSelectElem = document.querySelector('#leaveMember');
    body.forEach(elem => {
      const optionElem = document.createElement('option');
      optionElem.setAttribute('value', elem.name);
      optionElem.setAttribute('data-id', elem.id);
      optionElem.textContent = elem.name;
      memberSelectElem.append(optionElem);
    })
  });
}
drawMemberOption();

document.querySelector('#recipient-date').addEventListener('change', function() {
  document.querySelector('#leaveType').value = '0';
});

document.querySelector('#leaveMember').addEventListener('change', e => {
  const memberId = e.target.options[e.target.selectedIndex].dataset.id;
  getMemberLeaveInfo(memberId);
});

/* ** 
    ** DRAW MEMBER INFO **
    ** */
function getMemberLeaveInfo(memberId) {
  fetch('http://localhost:3001/member/' + memberId, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(body => {
    drawMemberLeaveInfo(body);
  });
}

function drawMemberLeaveInfo(memberInfo) {
  document.querySelector('#memberName').textContent = memberInfo.name;
  document.querySelector('#joiningCompanyDate').textContent = memberInfo.joiningCompanyDate;
  document.querySelector('#updateDate').textContent = memberInfo.updateDate;
  document.querySelector('#payDate').textContent = memberInfo.payDate;
}

function getMemberRemainLeaveCount(memberId) {
  return axios.get('http://localhost:3001/member/' + memberId)
  .then(response => response.data);
}

/* ** 
    ** Util**
    ** */
function getUniqueId() {
  function hexId() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
  }
  return hexId() + hexId() + '-' + hexId() + '-' + hexId() + '-' + hexId() + '-' + hexId() + hexId() + hexId();
}

function parsingFormatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function setSelectedOption(id, selected) {
  var selectTag = document.querySelector(id);
  if (selectTag == null) {
      return false;
  }
          
  if (selectTag.options == null || selectTag.options.length == 0) {
      return false;
  }
  
  if (selected == null) {
      selected = "";
  }
                  
  var optionCount = selectTag.options.length;
  for (var i=0; i<optionCount; i++) {
      if (selectTag.options[i].value == selected) {
          selectTag.options[i].selected = true;
          return true;
      }
  }
      
  return false;
} 