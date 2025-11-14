function Bindable(v) {
    const bindable = {
        _events: new EventTarget(),
        _value: v,
        set value(v) {
            this._value = v;
            this.dispatchEvent(new Event('change'));
        },

        get value() {
            return this._value;
        },

        addEventListener: function(type, listener, options=null) {
            this._events.addEventListener(type,listener,options)
        },

        dispatchEvent: function(event) {
            this._events.dispatchEvent(event);
        },

        removeEventListener: function(type, listener, options=null) {
            this._events.removeEventListener(type, listener, options)
        },
    }
    return bindable;
}

export default Bindable;