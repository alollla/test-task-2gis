"use strict";

function Deck (config){
	this.el = config.el;
	this.cardTemplate = config.cardTemplate;

	this.init = function(){
		if(!window.history.state){
			window.history.pushState(cards, "");
		}
		this.el.addEventListener('click',this.clickHandler,false);
		window.onpopstate = this.update;
		this.state = window.history.state;

		this.render();
	}
	
	this.render = function(){
		this.state.forEach(function(item,i,arr){
			var source = this.cardTemplate.innerHTML;
			var template = Handlebars.compile(source);
			this.el.innerHTML += template({
				index: (i+1),
				class: item.type
			});
		}.bind(this));
		this.checkClass();
	};

	this.clickHandler = function(e){
		if(e.altKey&&e.shiftKey){
			this.add({
				type:'wide'
			});
		} else if(e.shiftKey){
			this.add({
				type:'narrow'
			});
		} else {
			this.remove();
		}
	}.bind(this);
	
	this.add = function(newCard){
		this.state.push(newCard);
		window.history.pushState(this.state, "");
		this.update();
	};

	this.remove = function(){
		this.state.splice(-1);
		window.history.pushState(this.state, "");
		this.update();
	};

	this.update = function(){
		this.state = window.history.state;
		if(this.el.children.length < this.state.length){
			var source = this.cardTemplate.innerHTML;
			var template = Handlebars.compile(source);
			this.el.innerHTML += template({
				index: this.state.length,
				class: this.state[this.state.length-1].type
			});
		} else if(this.el.children.length > this.state.length){
			this.el.removeChild(this.el.lastElementChild);
		}
		this.checkClass();
	}.bind(this);

	this.checkClass = function(){
		if(this.el.children.length<=1){
			this.el.classList.add('single');
		} else {
			this.el.classList.remove('single');
		}
		if(this.el.lastElementChild&&this.el.lastElementChild.classList.contains('wide')){
			this.el.classList.add('wide-deck');
		} else {
			this.el.classList.remove('wide-deck');
		}
	}

	return this;
};



document.addEventListener('DOMContentLoaded',function(){
	window.deck = new Deck({
		el:document.getElementById('deck'),
		cardTemplate:document.getElementById('card-template')
	});
	deck.init();
},false);