/* ================================================================================================================= */
/*
 * DESCRIPTION:
 *   Initial bootstraping code for new windows.
 */
/* ================================================================================================================= */

require("../common/startup");

import { Subscription, fromEvent, merge} from "rxjs";
import { first } from "rxjs/operators";

import { EventType } from "./domEvents";
import { LogManager } from "../common/logging";

/* ================================================================================================================= */

export interface WindowOptions
{
    fileName: string;
    mainClass: string;
}

export interface IMainClass
{
    /**
     * Called at startup before the window has finished loading.
     */
    configure(): void;

    /**
     * Called once the window has finished loading.
     */
    ready(): void;
}

/* ================================================================================================================= */

function readOptions(): WindowOptions
{
    let str = window.location.hash.replace(/^#/, "");
    str = decodeURIComponent(str);
    return JSON.parse(str);
}

/* ================================================================================================================= */

var g_main: any;

/* ================================================================================================================= */
/**
 * Bootstraps a new window.
 * 
 * This function is responsible for reading parameters sent by the main process and creating the specified main class.
 */
export function bootstrap()
{
    const log = LogManager.getLogger("tau:bootstrap");
    const options = readOptions();

    try
    {
        log.debug("Loading file: {fileName}", options);
        const ext: any = require(options.fileName);
        log.debug("Loading main class: {mainClass}", options);

        g_main = new ext[options.mainClass]();
        g_main.configure();
    }
    catch (e)
    {
        log.error(e, "Unable to load main class {mainClass}", options);

        document.body.innerHTML = `<h1 class='error'>Unable to load main class ${options.mainClass}</h1>
<h2 class='error'>${e.name}</h2>
<div>${e.message}</div>
<pre>${e.stack}</pre>`;

        return;
    }

    let sub: Subscription;

    function continueLoad()
    {
        sub.unsubscribe();
        sub = null;

        log.debug("Calling {mainClass}.ready()", options);
        g_main.ready();
    }

    sub = merge(
        fromEvent(document, EventType.ContentLoaded),
        fromEvent(window, EventType.Load)
    ).pipe(first())
    .subscribe(continueLoad);
}

/* ================================================================================================================= */
