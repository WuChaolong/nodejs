var videoshow = require('videoshow');
var ffmpeg = require('fluent-ffmpeg');

var images = [
  {
    path: __dirname+"img/20160604"+'69.jpg',
    caption: '69'
  }, 
  {
    path: __dirname+"img/20160604"+'B9.jpg',
    caption: 'B9'
  }, 
  {
    path: __dirname+"img/20160604"+'TA.jpg',
    caption: 'TA'
  }, 
  {
    path: __dirname+"img/20160604"+'XC.jpg',
    caption: 'XC'
  }
]

var videoOptions = {
  fps: 25,
  loop: 5, // seconds
  transition: true,
  transitionDuration: 1, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4'
}

videoshow(images, videoOptions)
  .audio(__dirname+"img/20160604"+'HeiHei.mp3')
  .save(__dirname+"img"+'video.mp4')
  .on('start', function (command) {
    console.log('ffmpeg process started:', command)
  })
  .on('error', function (err, stdout, stderr) {
    console.error('Error:', err)
    console.error('ffmpeg stderr:', stderr)
  })
  .on('end', function (output) {
    console.error('Video created in:', output)
  })