dateSpan = (content,title=undefined)->
  if Em.isEmpty(title)
    "<span class=\"date\">#{content}</span>".htmlSafe()
  else
    "<span class=\"date\" title=\"#{title}\">#{content}</span>".htmlSafe()

Em.Handlebars.helper 'timeAgo', (value,clock,options)->
  m = moment(value)
  dateSpan(m.fromNow(), m.format('Mo of MMMM YYYY at H:mm:ss a'))

Em.Handlebars.helper 'dateAgo', (value,clock,options)->
  m = moment(value)
  calendar = m.calendar().split(' at')[0].toLowerCase()
  dateSpan(calendar, m.format('dddd Mo of MMMM YYYY'))

Em.Handlebars.helper 'dateWithYear', (value)->
  m = moment(value)
  dateSpan(m.format('MMMM Do YYYY'), m.format('dddd Mo of MMMM YYYY'))
