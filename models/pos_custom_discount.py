from odoo import models, fields, _ 


class PosCustomDiscount(models.Model):
    _name = 'pos.custom.discount'
    _description = 'Custom Discounts for POS'

    name = fields.Char(required=True)
    discount_pc = fields.Float(string='Discount Percentage', default=5, help='The default discount percentage')
    description = fields.Text()