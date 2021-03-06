/* global define */
var jsPsych = window.jsPsych || require('jspsych');
var sliders = [];

(function (root, factory) {
  if(typeof define === "function" && define.amd) {
     define([], factory);
  } else if(typeof module === "object" && module.exports) {
     module.exports = factory;
  } else {
     root.jsPsych.plugins['audio-slider-response'] = factory;
  }
}(this, (function() {
	var plugin = {};

	jsPsych.pluginAPI.registerPreload('audio-slider-response', 'stimulus', 'audio');

	plugin.info = {
		name: 'audio-slider-response',
		description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: [],
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: [],
        description: 'Sets the maximum value of the slider',
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 0.05,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the sliders.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name:'Slider width',
        default: null,
        description: 'Width of the slider in pixels.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Prompts',
        default: [],
        description: 'Any content here will be displayed below the slider.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    sliders = [];

    // setup stimulus
    var context = jsPsych.pluginAPI.audioContext();
    if(context !== null){
      var source = context.createBufferSource();
      source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
      source.connect(context.destination);
    } else {
      var audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
      audio.currentTime = 0;
    }

    // set up end event if trial needs it
    if(trial.trial_ends_after_audio){
      if(context !== null){
        source.onended = function() {
          end_trial();
        }
      } else {
        audio.addEventListener('ended', end_trial);
      }
    }

    var html = '<div id="jspsych-audio-slider-response-wrapper" style="margin: 50px 0px;">';
  	html += '<div class="jspsych-audio-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
    if(trial.slider_width !== null){
      html += 'width:'+trial.slider_width+'px;';
    }
    html += '">';
    for (var i = 0; i < trial.labels.length; i++) {
      
        html += "<h6>" + trial.prompt[i] + "</h6>";
        html += '<div style="margin: 10px 0 35px 0;">';
        html += '<div>';
        html += '<input type="range" value="'+trial.start[i]+'" min="'+trial.min[i]+'" max="'+trial.max[i]+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-audio-slider-response-response-' + i + '"></input>';
        html += '</div>';
        for(var j=0; j < trial.labels[i].length; j++){
            var width = 100/(trial.labels[i].length-1);
            var left_offset = (j * (100 /(trial.labels[i].length - 1))) - (width/2);
            html += '<div style="display: inline-block; position: absolute; left:'  +left_offset + '%; text-align: center; width: ' + width + '%;">';
            html += '<p style="text-align: center; font-size: 80%; margin-top: -8px;">'+trial.labels[i][j]+'</p>';
            html += '</div>'
        }
        html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
    
    // add submit button
    if (trial.exit !== undefined) {
      html += '<button id="jspsych-audio-slider-response-exit" class="jspsych-btn" style="background-color: #b50426; color: white; margin-right: 10px;" >Exit Experiment</button>';
    }
    html += '<button id="jspsych-audio-slider-response-next" class="jspsych-btn" style="background-color: ' + (trial.require_movement ? "#8FA78E" : "green") + '; color: white;" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';

    if (trial.extra_text_html) {

      html += "<div style='margin-top: 40px;'>" + trial.extra_text_html + "</div>"
    }

    display_element.innerHTML = html;

    var response = {
      rt: null,
      response: null
    };

    if(trial.require_movement){
      for (i = 0; i < trial.labels.length; i++) {
        display_element.querySelector('#jspsych-audio-slider-response-response-' + i).addEventListener('click', function(e){
          var fullId = e.target.id.split('-');
          var id = fullId[fullId.length - 1]
          if (!sliders.includes(id)) {
            sliders.push(id);
          }
          if (sliders.length === trial.labels.length) {
            display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;
            display_element.querySelector('#jspsych-audio-slider-response-next').style.backgroundColor = "green";
          }
        })
      }
    }
    
    display_element.querySelector('#jspsych-audio-slider-response-next').addEventListener('click', function() {
      // measure response time
      var endTime = performance.now();
			var rt = endTime - startTime;
			if(context !== null){
				endTime = context.currentTime;
				rt = Math.round((endTime - startTime) * 1000);
			}
      response.rt = rt;
      response.response = {};
      for (var i = 0; i < trial.labels.length; i++) {
        response.response[i] = display_element.querySelector('#jspsych-audio-slider-response-response-' + i).value
      }

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-audio-slider-response-next').disabled = true;
      }

    });
    if (trial.exit) {
      display_element.querySelector('#jspsych-audio-slider-response-exit').addEventListener('click', function() {
        trial.exit();
      })
    }

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

			if(context !== null){
        source.stop();
        source.onended = function() { }
      } else {
        audio.pause();
        audio.removeEventListener('ended', end_trial);
      }

      // save data
      var trialdata = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "response": response.response,
        "replayAudio": response.replayAudio
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

		var startTime = performance.now();
		// start audio
    if(context !== null){
      startTime = context.currentTime;
      source.start(startTime);
    } else {
      audio.play();
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }


  };

  return plugin;
})()
));
