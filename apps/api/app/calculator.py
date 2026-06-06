from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re

router = APIRouter()

class CalcRequest(BaseModel):
    expression: str

# Allow only numbers, whitespace, parentheses and basic operators
_SAFE_EXPR = re.compile(r'^[0-9\s\+\-\*\/\(\)\.]+$')

@router.post('/calculate')
async def calculate(request: CalcRequest):
    expr = request.expression.strip()
    if not _SAFE_EXPR.fullmatch(expr):
        raise HTTPException(status_code=400, detail='Invalid characters in expression')
    try:
        # Evaluate in a restricted namespace
        result = eval(expr, {"__builtins__": {}}, {})
        return {"expression": expr, "result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
