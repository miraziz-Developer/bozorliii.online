"""premium_tariffs — hourly pricing columns present in the model but never migrated."""

from alembic import op
import sqlalchemy as sa

revision = "0050_premium_hourly_pricing"
down_revision = "0049_customer_loyalty_coins"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "premium_tariffs",
        sa.Column("price_uzs_hourly", sa.Numeric(14, 2), nullable=True),
    )
    op.add_column(
        "premium_tariffs",
        sa.Column("hours_per_day", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("premium_tariffs", "hours_per_day")
    op.drop_column("premium_tariffs", "price_uzs_hourly")
