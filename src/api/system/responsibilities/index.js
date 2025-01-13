import request from '@/utils/request'

export function getDirectorate(data) {
  return request({
    url: '/system/meeting-duty-directorate/list',
    method: 'post',
    data
  })
}
export function getEmployee(data) {
  return request({
    url: '/system/meeting-duty-employee/list',
    method: 'post',
    data
  })
}
export function getIndepentdire(data) {
  return request({
    url: '/system/meeting-duty-indepentdire/list',
    method: 'post',
    data
  })
}
export function getShareholders(data) {
  return request({
    url: '/system/meeting-duty-shareholders/list',
    method: 'post',
    data
  })
}
export function getSpecialCommittee(data) {
  return request({
    url: '/system/meeting-duty-special-committee/list',
    method: 'post',
    data
  })
}
export function getSupervisory(data) {
  return request({
    url: '/system/meeting-duty-supervisory/list',
    method: 'post',
    data
  })
}
//删除
export function deleteDirectorate(data) {
  return request({
    url: `/system/meeting-duty-directorate/delete`,
    method: 'post',
    data
  });
}
export function deleteEmployee(data) {
  return request({
    url: `/system/meeting-duty-employee/delete`,
    method: 'post',
    data
  });
}

export function deleteIndepentdire(data) {
  return request({
    url: `/system/meeting-duty-indepentdire/delete`,
    method: 'post',
    data
  });
}

export function deleteShareholders(data) {
  return request({
    url: `/system/meeting-duty-shareholders/delete`,
    method: 'post',
    data
  });
}

export function deleteSpecialCommittee(data) {
  return request({
    url: `/system/meeting-duty-special-committee/delete`,
    method: 'post',
    data
  });
}

export function deleteSupervisory(data) {
  return request({
    url: `/system/meeting-duty-supervisory/delete`,
    method: 'post',
    data
  });
}
//更新
export function updateDirectorate(data) {
  return request({
    url: `/system/meeting-duty-directorate/update`,
    method: 'post',
    data
  });
}

export function updateEmployee(data) {
  return request({
    url: `/system/meeting-duty-employee/update`,
    method: 'post',
    data
  });
}

export function updateIndepentdire(data) {
  return request({
    url: `/system/meeting-duty-indepentdire/update`,
    method: 'post',
    data
  });
}

export function updateShareholders(data) {
  return request({
    url: `/system/meeting-duty-shareholders/update`,
    method: 'post',
    data
  });
}

export function updateSpecialCommittee(data) {
  return request({
    url: `/system/meeting-duty-special-committee/update`,
    method: 'post',
    data
  });
}

export function updateSupervisory(data) {
  return request({
    url: `/system/meeting-duty-supervisory/update`,
    method: 'post',
    data
  });
}

//新增
export function createDirectorate(data) {
  return request({
    url: `/system/meeting-duty-directorate/create`,
    method: 'post',
    data
  });
}

export function createEmployee(data) {
  return request({
    url: `/system/meeting-duty-employee/create`,
    method: 'post',
    data
  });
}

export function createIndepentdire(data) {
  return request({
    url: `/system/meeting-duty-indepentdire/create`,
    method: 'post',
    data
  });
}

export function createShareholders(data) {
  return request({
    url: `/system/meeting-duty-shareholders/create`,
    method: 'post',
    data
  });
}

export function createSpecialCommittee(data) {
  return request({
    url: `/system/meeting-duty-special-committee/create`,
    method: 'post',
    data
  });
}

export function createSupervisory(data) {
  return request({
    url: `/system/meeting-duty-supervisory/create`,
    method: 'post',
    data
  });
}
