"""empty message

Revision ID: 50b4e2903fcc
Revises: 68439a6ffc02
Create Date: 2024-12-15 04:03:26.100527

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '50b4e2903fcc'
down_revision: Union[str, None] = '68439a6ffc02'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('subexpressions',
    sa.Column('latex', sa.String(), nullable=False),
    sa.Column('formula_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['formula_id'], ['formulas.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subexpressions_latex'), 'subexpressions', ['latex'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_subexpressions_latex'), table_name='subexpressions')
    op.drop_table('subexpressions')
    # ### end Alembic commands ###