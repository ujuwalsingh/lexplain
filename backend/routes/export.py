from flask import Blueprint, jsonify

export_bp = Blueprint("export", __name__)

@export_bp.route("/export", methods=["GET"])
def export():
    # TODO: implement PDF/DOCX export
    return jsonify({"status": "Export not implemented yet"})
