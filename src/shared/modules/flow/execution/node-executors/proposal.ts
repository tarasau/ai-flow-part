import { Type } from '@sinclair/typebox';
import { DataItemSchema } from '@shared/modules/flow/types/data.types.ts';
import { FlowNode } from '@shared/modules/flow/types/node.types.ts';
import { mapDataItemToTypeBoxSchema } from '@shared/modules/flow/execution/validation.ts';
import { TypeCompiler } from '@sinclair/typebox/compiler';

class BaseCustomNode {
  // TODO: should return blala is HUI
  validateInputs() {
    // TODO: refactor for multiple inputs validation
    // const BodyValueSchema = mapDataItemToTypeBoxSchema(node.details.body.type);
    // const bodyValueSchema = TypeCompiler.Compile(BodyValueSchema);
    //
    // if (!bodyValueSchema.Check(node.details.body.value)) {
    //   throw new Error("Unexpected body format");
    // }
  }
}

export class MyCustomNode extends BaseCustomNode {
  public BodySchema = Type.Object({
    type: DataItemSchema,
    value: Type.Unknown(),
  });

  private initialInputs;
  private initialOutputs;

  public async onInit() {
    // fetch some stuff from your be for example, grab assets etc
  }

  public display() {
    const iframe = document.createElement('iframe');

    const script = `
    const elem = document.createElement('button');

    elem.onclick = () => {
      console.log('HEY');
    }

    parent.postMessage(elem.innerHTML, '*');
  `;

    iframe.contentWindow?.postMessage(script, '*');

    window.addEventListener('message', (event) => {
      console.log('Result from plugin1:', event.data);
    });
  }

  public execute(node: FlowNode, agrs: Array<unknown>) {
    super.validateInputs(node.details.inputs, agrs);
  }
}