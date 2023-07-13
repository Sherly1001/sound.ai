import torch
import torch.nn as nn

from typing import Any, List, OrderedDict


class Model:

    def __init__(self, model_info: Any) -> None:
        self.input_size = model_info['input_size']
        self.modules = model_info['modules']
        self.state: OrderedDict = model_info['state']

        self.load()

    def load(self):
        self.model = nn.ModuleDict(self.modules)
        self.model.load_state_dict(self.state)

    @staticmethod
    def save(path: str, input_size: int, model: nn.Module):
        out = {
            'input_size': input_size,
            'modules': list(model.named_children()),
            'state': model.state_dict(),
        }
        torch.save(out, path)

    def predict(self, input: List[complex]):
        inp = torch.tensor(input)
        inp = inp[:self.input_size]
        inp = nn.functional.pad(inp, (0, self.input_size - len(inp)))
        inp = torch.stack((inp.real, inp.imag), dim=0)
        inp = inp.reshape(1, 2, -1)

        with torch.no_grad():
            self.model.eval()

            out = inp
            for mod in self.model.children():
                out = mod(out)

            out = nn.functional.softmax(out, -1)
            out = out.reshape(-1)

            return out
