import {
  type Owner,
  createContext,
  useContext,
  ContextProviderComponent,
  createSignal,
  createEffect,
  For,
  Signal,
  runWithOwner,
} from "solid-js";
import { v4 as uuid } from "uuid";
import { createStore, produce } from "solid-js/store";
import { getPromiseWithResolvers } from "@shared/async/promise.ts";

export class CodeExecutor {
  private framesStore =
    createStore<Record<string, Signal<HTMLIFrameElement | null>>>();

  get frames() {
    return this.framesStore[0];
  }

  buildExecutionResultExtractor(result: string) {
    return `result = ${result};`;
  }

  execute(owner: Owner, scriptText: string) {
    const executionResult = runWithOwner(owner, () => {
      const id = uuid();
      const [, setFramesStore] = this.framesStore;

      const frameSignal = createSignal<HTMLIFrameElement | null>(null);
      const [frame] = frameSignal;

      const { promise, resolve } = getPromiseWithResolvers<string>();

      createEffect(() => {
        const iframe = frame();

        if (iframe) {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;

          if (!doc) {
            throw new Error("Unexpected iframe");
          }

          // Clear previous content
          doc.open();
          doc.close();

          const script = document.createElement("script");

          script.textContent = `
            const getWorkerMessenger = () => {
              const sendMessage = (
                functionBody,
                args = [],
                callback,
              ) => {
                const blob = new Blob(
                  [
                    \`
                    function send(e, v, reportSendError){
                      try {
                        postMessage({
                          value: v,
                          error: e ? {name: e.name, message: e.message, stack: e.stack} : undefined
                        });
                      } catch (err) {
                        if (reportSendError !== false) send(err, undefined, false);
                      }
                    }
                    
                    self.addEventListener(
                      "unhandledrejection",
                      function(e) {
                        e.preventDefault();
                        send(e.reason, undefined);
                      }
                    );
                    
                    onmessage = function (evt) {
                      let result, error;
                      try {
                        \${functionBody}
                      } catch (err) {
                        error = err;
                      }
                      
                      if (!error && result && typeof result.then === "function") {
                        result.then(
                          function (r) {result = r;},
                          function (e) {error = e;}
                        ).finally(function () {
                          send(error, result);
                        });
                      } else {
                        send(error, result);
                      }
                    }
                  \`,
                  ],
                  {
                    type: "application/javascript",
                  },
                );
          
                const workerURL = URL.createObjectURL(blob);
                const worker = new Worker(workerURL);
                const cleanup = () => {
                  worker.terminate();
                  URL.revokeObjectURL(workerURL);
                };
          
                worker.onmessage = ({
                  data: { value, error },
                }) => {
                  let err = null;
          
                  if (error) {
                    err = new Error(error.message);
                    err.name = error.name;
                    err.stack = error.stack;
                  }
          
                  cleanup();
                  callback(err, value);
                };
          
                worker.onerror = (err) => {
                  err.preventDefault();
                  err.stopPropagation();
                  cleanup();
                  let error = err.error;
                  if (!error) {
                    error = new Error("SyntaxError");
                  }
                  callback(error, undefined);
                };
          
                worker.postMessage(args);
              };
              sendMessage.type = "worker";
              return sendMessage;
            };
            
            const send = getWorkerMessenger();
            
            send(
              \`${scriptText}\`,
              [],
              (err, res) => {
                parent.postMessage(res, '*');
              },
            );
          `;

          window.addEventListener("message", (event) => {
            resolve(event.data);
          });

          // TODO: <meta http-equiv="Content-Security-Policy" content="default-src https:" />;
          doc.body.appendChild(script);

          promise.then(() =>
            setFramesStore(
              produce((frames) => {
                delete frames[id];
              }),
            ),
          );
        }
      });

      setFramesStore(id, frameSignal);

      return promise;
    });

    if (!executionResult) {
      throw new Error("Unexpected execution result");
    }

    return executionResult;
  }
}

const CodeExecutorContext = createContext<CodeExecutor>();

export const CodeExecutorProvider: ContextProviderComponent<CodeExecutor> = (
  props,
) => {
  const frames = props.value.frames;

  return (
    <CodeExecutorContext.Provider value={props.value}>
      <div style={{ display: "none" }}>
        <For each={Object.entries(frames)}>
          {([id, frameSignal]) => (
            <iframe
              id={id}
              ref={(el) => frameSignal[1](el)}
              title=""
              src="https://google.com"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          )}
        </For>
      </div>
      {props.children}
    </CodeExecutorContext.Provider>
  );
};

export const useCodeExecutor = () => {
  return useContext(CodeExecutorContext);
};
