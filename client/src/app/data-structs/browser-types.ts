/**
 * Reliable browser detection.
 */
export class Browser {
    /**
     * @returns true if browser is Opera 8.0+
     */
    public static isOpera(): boolean {
        /*
        return (!!window.opr && !!opr.addons) || !!window.opera ||
        navigator.userAgent.indexOf(' OPR/') >= 0;
        */
        return navigator.userAgent.indexOf("Opera") != -1;
    }

    /**
     * @returns true if browser is Firefox 1.0+
     */
    public static isFirefox(): boolean {
        //return typeof InstallTrigger !== 'undefined';
        return navigator.userAgent.indexOf("Firefox") != -1;
    }

    /**
     * @returns true if browser is Safari 3.0+
     */
    public static isSafari(): boolean {
        /*
        /constructor/i.test(window.HTMLElement) || 
        (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(
            !window['safari'] || 
            (typeof safari !== 'undefined' && window['safari'].pushNotification));
        */
        return navigator.userAgent.indexOf("Safari") != -1;
    }

    /**
     * @returns true if browser is Chrome 1-79
     */
    public static isChrome(): boolean {
        //return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        return navigator.userAgent.indexOf("Chrome") != -1;
    }

    /**
     * @returns true if browser is chromium based Edge
     */
    public static isEdgeChromium(): boolean {
        return Browser.isChrome() && (navigator.userAgent.indexOf("Edg") != -1);
    }

    /**
     * @returns true if browser runs Blink engine
     */
    public static isBlink(): boolean {
        return (Browser.isChrome() || Browser.isOpera()) && !!window.CSS;
    }
}