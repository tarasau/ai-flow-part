# Glossary

- Flow - Executable graph
- FlowNode - Graph item. Atomic executable piece
- Inputs - set of parameters Node excepts
- Outputs - set of parameters Node returns once executed
- Connection - Graph edge. Connects Nodes with specified Input/Output pair
- DataItem - Atomic piece of data that can be passed between Nodes via Inputs/Outputs and be validated




Functions to expose to custom executor
- Pick Model (open app modal with `DataItemSchema` creator / pre-created picker)
- Throw
- Manipulate Inputs/Outputs
- ...

- Make user provide their own implementations for custom nodes during flow executor initiation.
This way we wouldn't need to implement isolated runtime for all the platforms.
Bundled nodes (written by us) can be omitted
