from sympy import latex
from sympy.parsing.latex import parse_latex
from sympy.core.expr import Expr
from typing import List, Set


def get_latex_subexpressions(expr: str, min_subtree_len: int = 1) -> List[str]:
    """
    Given a LaTeX string, this function returns a list of LaTeX representations
    of its subexpressions (subtrees) using a recursive approach, limited to subtrees
    with at least `min_subtree_len` arguments.

    Args:
        expr (str): The input LaTeX expression as a string.
        min_subtree_len (int): Minimum number of arguments required for a subtree to be collected.

    Returns:
        List[str]: A list of LaTeX representations of subexpressions (subtrees).
    """
    latex_expr = parse_latex(expr)

    subtree_mappings: List[str] = []
    seen: Set[Expr] = set()

    def traverse(current_expr: Expr):
        if current_expr in seen:
            return
        seen.add(current_expr)

        if hasattr(current_expr, "args"):
            if len(current_expr.args) >= min_subtree_len:
                subtree_mappings.append(latex(current_expr))
        else:
            if min_subtree_len <= 0:
                subtree_mappings.append(latex(current_expr))

        for arg in current_expr.args if hasattr(current_expr, "args") else []:
            if isinstance(arg, Expr):
                traverse(arg)

    traverse(latex_expr)

    return subtree_mappings
