using System;
using System.IO;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UglyToad.PdfPig;
using LexAudit.Application.Interfaces;

namespace LexAudit.Infrastructure.Services;

public class PdfExtractorService : IPdfExtractor
{
    public (bool isText, int pageCount) ExtractHeuristics(Stream pdfStream)
    {
        try
        {
            var startPos = pdfStream.Position;
            using var document = PdfDocument.Open(pdfStream);
            int pageCount = document.NumberOfPages;
            
            if (pageCount == 0) return (false, 0);

            var firstPage = document.GetPage(1);
            var text = firstPage.Text;
            bool hasText = !string.IsNullOrWhiteSpace(text) && text.Length > 50;

            if (pdfStream.CanSeek) pdfStream.Position = startPos;

            return (hasText, pageCount);
        }
        catch
        {
            return (false, 0);
        }
    }

    public async Task<List<string>> ExtractParagraphsAsync(Stream fileStream, CancellationToken ct)
    {
        var paragraphs = new List<string>();
        var startPos = fileStream.Position;
        
        using var document = PdfDocument.Open(fileStream);

        for (int i = 1; i <= document.NumberOfPages; i++)
        {
            ct.ThrowIfCancellationRequested();
            
            var page = document.GetPage(i);
            var text = page.Text;
            
            var blocks = text.Split(new[] { "\n\n", "\r\n\r\n" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var block in blocks)
            {
                if (block.Length > 20)
                {
                    paragraphs.Add(block.Trim());
                }
            }
            
            await Task.Yield();
        }

        if (fileStream.CanSeek) fileStream.Position = startPos;
        return paragraphs;
    }
}
