using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using LexAudit.Domain.Entities;
using LexAudit.Application.Interfaces;

namespace LexAudit.Application.Audit.Pipeline;

public class Stage1_StructuralExtractor
{
    private readonly IPdfExtractor _pdfExtractor;

    public Stage1_StructuralExtractor(IPdfExtractor pdfExtractor)
    {
        _pdfExtractor = pdfExtractor;
    }

    public async Task<List<string>> ExtractParagraphsAsync(Contract contract, Stream fileStream, CancellationToken ct)
    {
        // Use the infrastructure service via interface
        var paragraphs = await _pdfExtractor.ExtractParagraphsAsync(fileStream, ct);
        
        // Additional business logic could go here (e.g. tracking clause lengths, numbering them, etc.)
        
        return paragraphs;
    }
}
