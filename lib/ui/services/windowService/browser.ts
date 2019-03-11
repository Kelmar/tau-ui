/* ================================================================================================================= */
/* ================================================================================================================= */

import { endpoint, event, service, ServiceTarget } from "../../../services";

import { WindowID, WindowOpenOptions, IWindowService } from "./common";
import { Observable } from "rxjs";

/* ================================================================================================================= */

@service(IWindowService, ServiceTarget.Browser)
export class BrowserWindowService implements IWindowService
{
    @endpoint
    public open(indexFile: string, mainFile: string, options?: WindowOpenOptions): Promise<WindowID>
    {
        return Promise.resolve(0);
    }

    @endpoint
    public close(window: WindowID): Promise<void>
    {
        return Promise.resolve();
    }
}

/* ================================================================================================================= */
